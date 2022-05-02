const ERROR = {
	INVALID_EMAIL: "Invalid email",
	INVALID_PASSWORD: "Invalid password",
	INVALID_USERNAME: "Invalid username",
};
const SUCCESS = {
	LOGIN_SUCCESS: "Login success",
	REGISTER_SUCCESS: "Register success",
	LOGOUT_SUCCESS: "Logout success",
	UPDATE_PROFILE_SUCCESS: "Update profile success",
	UPDATE_PASSWORD_SUCCESS: "Update password success",
	UPDATE_AVATAR_SUCCESS: "Update avatar success",
};
const STATUS_CODE = {
	SUCCESS: 200,
	CREATED: 201,
	ACCEPTED: 202,
	NO_CONTENT: 204,
	BAD_REQUEST: 400,
	UNAUTHORIZED: 401,
	FORBIDDEN: 403,
	NOT_FOUND: 404,
	INTERNAL_SERVER_ERROR: 500,
	BAD_GATEWAY: 502,
	SERVICE_UNAVAILABLE: 503,
};

module.exports = {
	ERROR,
	SUCCESS,
	STATUS_CODE,
};
