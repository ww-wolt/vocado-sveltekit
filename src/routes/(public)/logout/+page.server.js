import { redirect } from '@sveltejs/kit';

export function load({ locals }) {
	locals.pb.authStore.clear();
	redirect(307, '/login');
}
