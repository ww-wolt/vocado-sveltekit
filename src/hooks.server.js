import { POCKETBASE_URL } from '$env/static/private';

import PocketBase from 'pocketbase';
import { serializeNonPOJOs } from '$lib/utils';

export const handle = async ({ event, resolve }) => {
	event.locals.pb = new PocketBase(POCKETBASE_URL);
	event.locals.pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');

	if (event.locals.pb.authStore.isValid) {
		event.locals.user = serializeNonPOJOs(event.locals.pb.authStore.model);
	} else {
		event.locals.user = undefined;
	}

  event.locals.loggedIn = event.locals.pb.authStore.isValid;

	const response = await resolve(event);

	// event.cookies.set("pb_auth", event.locals.pb.authStore.exportToCookie())
	response.headers.set('set-cookie', event.locals.pb.authStore.exportToCookie({ secure: false })); 

	return response;
};