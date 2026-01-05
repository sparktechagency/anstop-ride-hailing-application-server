import admin, { ServiceAccount } from "firebase-admin";
import { config } from "../config";

const serviceAccountCredentials = {
	type: config.firebaseConfig.type,
	project_id: config.firebaseConfig.project_id,
	private_key_id: config.firebaseConfig.private_key_id,
	private_key: config.firebaseConfig.private_key!.replace(/\\n/g, '\n'), // important!
	client_email: config.firebaseConfig.client_email,
	client_id: config.firebaseConfig.client_id,
	auth_uri: config.firebaseConfig.auth_uri,
	token_uri: config.firebaseConfig.token_uri,
	auth_provider_x509_cert_url: config.firebaseConfig.auth_provider_x509_cert_url,
	client_x509_cert_url: config.firebaseConfig.client_x509_cert_url,
	universe_domain: config.firebaseConfig.universe_domain,
} as ServiceAccount;

const app = admin.initializeApp({
	credential: admin.credential.cert(serviceAccountCredentials),
});

export { app };
