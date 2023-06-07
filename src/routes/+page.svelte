<script lang="ts">
	import { onMount } from 'svelte';
	import { kunden_store } from '../lib/kunden_store_4';
	import type { Kunde } from '../lib/types';

	const neuer_kunde: Kunde = {
		id: 0,
		name: ''
	};

	onMount(async () => {
		await kunden_store.load();
	});

	async function save() {
		if (!neuer_kunde) return;

		await kunden_store.save(neuer_kunde);
		neuer_kunde.name = '';
	}
</script>

<main>
	<div class="header">
		<h1>FP Workshop</h1>
		<button on:click={kunden_store.load}>Reload</button>
	</div>

	<div>
		<input type="text" bind:value={neuer_kunde.name} />
		<button on:click={save}>Speichern</button>
	</div>

	{#if $kunden_store.error}
		<div class="error">
			{$kunden_store.error}
		</div>
	{/if}

	<div class="kunden">
		{#each $kunden_store.data as kunde}
			<div class="kunde">
				{kunde.id} - {kunde.name}
			</div>
		{:else}
			Keine Kunden vorhanden
		{/each}
	</div>
</main>

<style>
	main {
		margin: 100px 200px;
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.header {
		display: flex;
		gap: 20px;
		align-items: center;
	}

	.header button {
		padding: 12px;
	}

	.kunden {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.error {
		border: 1px solid red;
		padding: 10px;
	}
</style>
