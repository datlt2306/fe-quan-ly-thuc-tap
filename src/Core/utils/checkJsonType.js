export default function isJSON(data) {
	try {
		return !!JSON.parse(data);
	} catch (error) {
		return false;
	}
}
