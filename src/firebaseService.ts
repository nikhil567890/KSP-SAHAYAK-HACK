import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, doc, getDocs, setDoc, writeBatch, terminate, disableNetwork, setLogLevel } from "firebase/firestore";

// Safely detect environment to prevent "process is not defined" ReferenceError in browser
const isServerEnv = typeof process !== "undefined" && process.env;

// Config provided by user, reading from env with fallback to actual user values
const firebaseConfig = {
  apiKey: (isServerEnv && process.env.FIREBASE_API_KEY) || "AIzaSyAlY3UhFnuzxRCBL4ZY3Zd8oX-Pz21SqMU",
  authDomain: (isServerEnv && process.env.FIREBASE_AUTH_DOMAIN) || "ksp-sahayak.firebaseapp.com",
  projectId: (isServerEnv && process.env.FIREBASE_PROJECT_ID) || "ksp-sahayak",
  storageBucket: (isServerEnv && process.env.FIREBASE_STORAGE_BUCKET) || "ksp-sahayak.firebasestorage.app",
  messagingSenderId: (isServerEnv && process.env.FIREBASE_MESSAGING_SENDER_ID) || "1029507127726",
  appId: (isServerEnv && process.env.FIREBASE_APP_ID) || "1:1029507127726:web:6846d0aa1bb0f14ae6903f",
  measurementId: (isServerEnv && process.env.FIREBASE_MEASUREMENT_ID) || "G-Q1VKLR2NWV"
};

let app: any;
let db: any = null;
let isInitialized = false;
let firestoreChecked = false;

// Global status tracker to communicate database readiness to the UI
const syncEnabled = true;

export let firestoreStatus = {
  enabled: syncEnabled,
  error: null as string | null,
  errorLink: `https://console.developers.google.com/apis/api/firestore.googleapis.com/overview?project=${firebaseConfig.projectId}`,
  projectId: firebaseConfig.projectId,
  usingFallback: false,
  syncDisabled: false
};

// Preemptive check using Firestore REST API to identify if the '(default)' database is created
export async function ensureFirestoreChecked(): Promise<boolean> {
  if (firestoreChecked) {
    return firestoreStatus.enabled;
  }

  if (typeof fetch === "undefined") {
    firestoreChecked = true;
    return firestoreStatus.enabled;
  }

  try {
    const url = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents`;
    const response = await fetch(url);
    
    // 404 NOT_FOUND returned by Firestore REST endpoint indicates that the database doesn't exist in the project
    if (response.status === 404) {
      const data = await response.json().catch(() => ({}));
      if (
        data?.error?.status === "NOT_FOUND" || 
        data?.error?.message?.includes("not found") || 
        data?.error?.message?.includes("database")
      ) {
        firestoreStatus.enabled = false;
        firestoreStatus.usingFallback = true;
        firestoreStatus.error = "Cloud Firestore database (default) has not been created or found in your Firebase project.";
        firestoreStatus.errorLink = `https://console.firebase.google.com/project/${firebaseConfig.projectId}/firestore`;
        console.warn(`🛑 Preemptive Firestore REST Check: Cloud Firestore database not found in project "${firebaseConfig.projectId}". Automatically defaulting to high-performance local sandbox.`);
      }
    }
  } catch (err) {
    console.warn("⚠️ Preemptive Firestore REST Check failed (CORS/Network), allowing normal initialization:", err);
  }

  firestoreChecked = true;
  return firestoreStatus.enabled;
}

// Error handling helper to capture API disabled / permission denied issues
function handleFirestoreError(error: any) {
  const errMsg = error?.message || String(error);
  console.error("⚠️ Firestore Connection Error:", errMsg);

  const isPermissionOrDisabled = 
    errMsg.includes("PERMISSION_DENIED") || 
    errMsg.includes("not been used in project") || 
    errMsg.includes("disabled") ||
    errMsg.includes("failed-precondition");

  const isNotFound = 
    errMsg.includes("NOT_FOUND") || 
    errMsg.includes("not-found") ||
    errMsg.includes("Code: 5") ||
    (error && (error.code === "not-found" || error.code === 5));

  if (isPermissionOrDisabled || isNotFound) {
    firestoreStatus.enabled = false;
    firestoreStatus.usingFallback = true;
    
    if (isNotFound) {
      firestoreStatus.error = "Cloud Firestore database (default) has not been created or found in your Firebase project.";
      firestoreStatus.errorLink = `https://console.firebase.google.com/project/${firebaseConfig.projectId}/firestore`;
    } else {
      firestoreStatus.error = "Cloud Firestore API has not been used or is disabled in your project.";
      // Extract the developer console activation link if present
      const linkMatch = errMsg.match(/https:\/\/console\S+/);
      if (linkMatch) {
        firestoreStatus.errorLink = linkMatch[0].replace(/then|retry|[\s.,)]+$/g, "");
      } else {
        firestoreStatus.errorLink = `https://console.developers.google.com/apis/api/firestore.googleapis.com/overview?project=${firebaseConfig.projectId}`;
      }
    }
    
    // Safely disable network and terminate the Firestore connection to stop background gRPC stream retries
    if (db) {
      try {
        disableNetwork(db)
          .then(() => {
            console.log("🔌 Firestore network connections disabled successfully.");
            return terminate(db);
          })
          .then(() => {
            console.log("🛑 Active Firestore connection terminated cleanly.");
          })
          .catch((err: any) => {
            console.warn("⚠️ Error in disabling/terminating Firestore:", err);
          });
      } catch (termErr) {
        console.warn("⚠️ Failed to terminate Firestore instance cleanly:", termErr);
      }
    }
    
    console.warn("🛑 GRACEFUL FALLBACK ACTIVATED: Halting active Firebase synchronizations to avoid stream errors. KSP Sahayak is operating fully in high-performance Local-First Sandbox Mode.");
  }
}

export function getFirestoreStatus() {
  return firestoreStatus;
}

export function initFirebase() {
  if (!firestoreStatus.enabled) {
    return { app: null, db: null };
  }
  if (isInitialized) {
    return { app, db };
  }
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    try {
      setLogLevel("silent");
    } catch (e) {
      // Ignore if setLogLevel fails or is unsupported
    }
    db = getFirestore(app);
    isInitialized = true;
    console.log("🔥 Firebase successfully initialized with Project ID:", firebaseConfig.projectId);
    return { app, db };
  } catch (error: any) {
    handleFirestoreError(error);
    return { app: null, db: null };
  }
}

// Generic fetch collection helper
export async function fetchCollectionFromFirebase(collectionName: string): Promise<any[] | null> {
  await ensureFirestoreChecked();
  if (!firestoreStatus.enabled) {
    return null;
  }
  const { db } = initFirebase();
  if (!db) {
    return null;
  }
  try {
    const colRef = collection(db, collectionName);
    const snapshot = await getDocs(colRef);
    const list: any[] = [];
    snapshot.forEach(docSnap => {
      list.push({ id: docSnap.id, ...docSnap.data() });
    });
    return list;
  } catch (error: any) {
    handleFirestoreError(error);
    return null;
  }
}

// Generic write helper
export async function saveDocumentToFirebase(collectionName: string, docId: string, data: any): Promise<boolean> {
  await ensureFirestoreChecked();
  if (!firestoreStatus.enabled) {
    return false;
  }
  const { db } = initFirebase();
  if (!db) {
    return false;
  }
  try {
    const docRef = doc(db, collectionName, docId);
    const sanitized = JSON.parse(JSON.stringify(data));
    await setDoc(docRef, sanitized, { merge: true });
    return true;
  } catch (error: any) {
    handleFirestoreError(error);
    return false;
  }
}

// Bulk Sync Seeder (To run if Firestore has 0 documents)
export async function syncSeedsToFirestore(
  collectionName: string,
  seeds: any[]
): Promise<number> {
  await ensureFirestoreChecked();
  if (!firestoreStatus.enabled) {
    return 0;
  }
  const { db } = initFirebase();
  if (!db || !seeds || seeds.length === 0) {
    return 0;
  }

  try {
    const colRef = collection(db, collectionName);
    const snapshot = await getDocs(colRef);
    
    // Only seed if collection is currently empty
    if (snapshot.empty) {
      console.log(`🌱 Collection [${collectionName}] is empty. Seeding ${seeds.length} records...`);
      let successCount = 0;
      
      const chunkSize = 100;
      for (let i = 0; i < seeds.length; i += chunkSize) {
        const chunk = seeds.slice(i, i + chunkSize);
        const batch = writeBatch(db);
        
        chunk.forEach(item => {
          const id = item.id || String(item._id) || `auto-${Math.random().toString(36).substr(2, 9)}`;
          const docRef = doc(db, collectionName, id);
          const sanitized = JSON.parse(JSON.stringify(item));
          batch.set(docRef, sanitized);
        });
        
        await batch.commit();
        successCount += chunk.length;
      }
      
      console.log(`✅ Successfully seeded ${successCount} records into [${collectionName}].`);
      return successCount;
    }
    return 0;
  } catch (error: any) {
    handleFirestoreError(error);
    return 0;
  }
}
