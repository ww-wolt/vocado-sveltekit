import { fail, redirect } from '@sveltejs/kit';

export function load({ locals }) {
	if (locals.loggedIn) {
		redirect(303, `/`);
	}
}

export const actions = {
	register: async ({ locals, request }) => {
		const data = Object.fromEntries(await request.formData());
		try {
			const languageRecord = await locals.pb
				.collection('languages')
				.getFirstListItem('code="DE"', {});
			await locals.pb.collection('users').create({
				...data,
				passwordConfirm: data.password,
				baseLanguage: languageRecord.id
			});
			await locals.pb.collection('users').authWithPassword(data.email, data.password);
		} catch (error) {
			console.error(`Registration error for ${data.email}: ${error?.response?.message}`);
			delete data.password; // Exclude password in returned data as security precaution
			return fail(422, { ...data, error: true });
		}
		redirect(303, '/');
	}
};
