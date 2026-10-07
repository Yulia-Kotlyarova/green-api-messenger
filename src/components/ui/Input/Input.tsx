import type { InputHTMLAttributes } from 'react';

import { classNames } from '@/helpers/classNames';

import styles from './Input.module.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	id: string;
	label?: string;
	error?: string;
	helperText?: string;
}

export const Input = ({ label, error, helperText, id, name, className, ...props }: InputProps) => {
	return (
		<div className={styles.wrapper}>
			{label && (
				<label className={styles.label} htmlFor={id}>
					{label}
				</label>
			)}

			<input
				id={id}
				name={name}
				className={classNames(
					styles.input,
					{
						[styles.errorInput]: Boolean(error),
					},
					[className],
				)}
				{...props}
			/>

			{error && <span className={styles.error}>{error}</span>}

			{!error && helperText && <span className={styles.helperText}>{helperText}</span>}
		</div>
	);
};
