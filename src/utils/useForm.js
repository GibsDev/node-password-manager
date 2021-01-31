import { useState } from 'react';

export const useForm = initialValues => {
	const [fields, setFields] = useState(initialValues);

	return [fields, e => {
		setFields({ ...fields, [e.target.name]: e.target.value });
	}];
};
