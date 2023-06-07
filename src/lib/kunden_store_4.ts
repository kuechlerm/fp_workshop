import { writable } from 'svelte/store';
import type { Display_State, Kunde } from './types';
import { get_data } from './api';
import { pipe } from 'fp-ts/lib/function';
import * as TE from 'fp-ts/lib/TaskEither';
import * as E from 'fp-ts/lib/Either';

const create_store = () => {
	const store = writable<Display_State<Kunde[]>>({
		loading: true,
		error: '',
		data: []
	});

	const load = pipe(
		TE.tryCatch(
			() => get_data('kunden'),
			(error) => 'Fehler - API ist nicht erreichbar'
		),
		TE.flatMap((response) =>
			pipe(
				response.data, //
				E.fromNullable('Fehler beim Lesen der Daten'),
				TE.fromEither
			)
		),
		TE.flatMap((text) =>
			pipe(
				E.tryCatch(
					() => JSON.parse(text) as Kunde[],
					(error) => 'Fehler beim Parsen der Daten'
				),
				TE.fromEither
			)
		),
		TE.match(
			(error) => {
				store.set({
					loading: false,
					error,
					data: []
				});
			},
			(data) => {
				store.set({
					loading: false,
					error: '',
					data
				});
			}
		)
	);

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
