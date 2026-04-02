/// <reference types="@sveltejs/kit" />

declare global {
	namespace App {
		interface Locals {
			userId: string | null;
			sessionId: string | null;
			sessionToken: string | null;
			userName: string | null;
		}
	}
}

export {};
