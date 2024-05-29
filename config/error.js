class ValidationError extends Error {
	constructor(message) {
		super(message);
		this.name = "ValidationError";
	}
}

class DuplicateEmailError extends Error {
	constructor(message) {
		super(message);
		this.name = "DuplicateEmailError";
	}
}

class PasswordResetError extends Error {
	constructor(message) {
		super(message);
		this.name = "PasswordResetError";
	}
}

export { ValidationError, DuplicateEmailError, PasswordResetError };
