import type { Api_Response, Kunde } from './types';

let result_case = 0;

const db: Kunde[] = [
	{ id: 1, name: 'Hans' },
	{ id: 2, name: 'Peter' },
	{ id: 3, name: 'Klaus' }
];

export async function get_data(query: string): Promise<Api_Response> {
	change_case();

	if (result_case === 0) {
		return { ok: true, data: JSON.stringify(db) };
	} else if (result_case === 1) {
		return { ok: true, data: 'GARBAGE' };
	} else if (result_case === 2) {
		return { ok: false, data: null };
	} else {
		throw new Error('API OFFLINE');
	}
}

function change_case() {
	result_case = (result_case + 1) % 4;
}
