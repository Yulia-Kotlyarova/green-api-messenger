import { useState } from 'react';

import { useAuth } from '@/context/AuthContext';

import styles from './LoginPage.module.css';
import { Input } from '@/components/ui/Input/Input.tsx';
import { Button } from '@/components/ui/Button/Button.tsx';

export const LoginPage = () => {
	const { login } = useAuth();

	const [idInstance, setIdInstance] = useState('');
	const [apiTokenInstance, setApiTokenInstance] = useState('');

	const isSubmitDisabled = !idInstance.trim() || !apiTokenInstance.trim();

	return (
		<main className={styles.page}>
			<form
				className={styles.form}
				onSubmit={(event) => {
					event.preventDefault();

					login({
						idInstance: idInstance.trim(),
						apiTokenInstance: apiTokenInstance.trim(),
					});
				}}
			>
				<div className={styles.header}>
					<h1 className="title">Telegram Chat</h1>

					<p className="subtitle">Введите данные вашего аккаунта GREEN-API</p>
				</div>

				<div className={styles.fields}>
					<Input
						id="idInstance"
						label="idInstance"
						value={idInstance}
						onChange={(event) => setIdInstance(event.target.value)}
						autoComplete="off"
					/>

					<Input
						id="apiTokenInstance"
						label="apiTokenInstance"
						type="password"
						value={apiTokenInstance}
						onChange={(event) => setApiTokenInstance(event.target.value)}
						autoComplete="off"
					/>
				</div>

				<Button type="submit" disabled={isSubmitDisabled} className={styles.submit}>
					Войти
				</Button>
			</form>
		</main>
	);
};
