import { redirect } from '@sveltejs/kit';

export function load({ locals, url }) {
	if (!locals.loggedIn) {
		redirect(307, `/login?redirectTo=${url.pathname}`);
	}
}
