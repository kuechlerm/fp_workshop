import { writable } from 'svelte/store';
import type { Api_Response, Display_State, Kunde } from './types';
import { get_data } from './api';
import { pipe } from 'fp-ts/lib/function';
import * as TE from 'fp-ts/lib/TaskEither';
import * as E from 'fp-ts/lib/Either';

const get_data_safe =
	(query: string): TE.TaskEither<Error, Api_Response> =>
	async () => {
		try {
			const result = await get_data(query);
			return E.right(result);
		} catch (error) {
			return E.left(error as Error);
		}
	};

const create_store = () => {
	const store = writable<Display_State<Kunde[]>>({
		loading: true,
		error: '',
		data: []
	});

	const load = pipe(
		TE.tryCatch(() => get_data('kunden'), E.toError),
		TE.flatMap((response) =>
			pipe(
				response.data, //
				E.fromNullable(new Error('response.data is null')),
				TE.fromEither
			)
		),
		TE.flatMap((text) =>
			pipe(
				E.tryCatch(() => JSON.parse(text), E.toError),
				TE.fromEither
			)
		),
		TE.match(
			(error) => {
				store.set({
					loading: false,
					error: error.message,
					data: []
				});
			},
			(data) => {
				store.set({
					loading: false,
					error: '',
					data: data as Kunde[]
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
