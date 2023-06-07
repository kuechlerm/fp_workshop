import { writable } from 'svelte/store';
import type { Display_State, Kunde } from './types';
import { get_data } from './api';

const create_store = () => {
	const store = writable<Display_State<Kunde[]>>({
		loading: true,
		error: '',
		data: []
	});

	const load = async () => {
		const response = await get_data('kunden');

		if (response.ok) {
			store.set({
				loading: false,
				error: '',
				data: JSON.parse(response.data!)
			});
		} else {
			store.set({
				loading: false,
				error: 'response not ok',
				data: []
			});
		}
	};

	const save = async (kunde: Kunde) => {
		store.update((current) => {
			const new_id = current.data.length ? Math.max(...current.data.map((k) => k.id)) + 1 : 1;
			current.data = [...current.data, { ...kunde, id: new_id }];

			return current;
		});
	};

	return {
		...store,
		load,
		save
	};
};

export const kunden_store = create_store();
