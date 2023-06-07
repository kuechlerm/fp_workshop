export type Kunde = {
	id: number;
	name: string;
};

export type Api_Response = {
	ok: boolean;
	data: string | null;
};

export type Display_State<T> = {
	loading: boolean;
	error: string;
	data: T;
};
