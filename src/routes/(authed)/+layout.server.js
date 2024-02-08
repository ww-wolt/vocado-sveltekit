import { redirect } from '@sveltejs/kit';

export function load({ locals, url }) {
	if (!locals.loggedIn) {
		redirect(303, `/login?redirectTo=${url.pathname}`);
	}
}
