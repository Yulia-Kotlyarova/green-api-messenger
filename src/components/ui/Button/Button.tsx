import type { ButtonHTMLAttributes } from 'react';

import styles from './Button.module.css';
import { classNames } from '@/helpers/classNames.ts';

type ButtonVariant = 'primary' | 'secondary';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: ButtonVariant;
}

export const Button = ({ children, className, variant = 'primary', ...props }: ButtonProps) => {
	return (
		<button className={classNames(styles.button, {}, [styles[variant], className])} {...props}>
			{children}
		</button>
	);
};
