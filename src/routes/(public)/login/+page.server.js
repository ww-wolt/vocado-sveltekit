import { fail, redirect } from '@sveltejs/kit';

export function load({ locals, url }) {
	if (locals.loggedIn) {
		redirect(303, `/`);
	}

	// Make redirectTo query param available in page data so it can also be used as a query param on the action
	const redirectTo = url.searchParams.get('redirectTo');
	return { redirectTo };
}

export const actions = {
	login: async ({ locals, request, url }) => {
		console.log('🚀 ~ login: ~ url:', url);
		const data = Object.fromEntries(await request.formData());

		try {
			await locals.pb.collection('users').authWithPassword(data.email, data.password);
		} catch (error) {
			console.error(`Authentication error for ${data.email}: ${error?.response?.message}`);
			delete data.password; // Exclude password in returned data as security precaution
			return fail(422, { ...data, error: true });
		}
		const redirectTo = url.searchParams.get('redirectTo');
		redirect(303, redirectTo || '/');
	}
};
