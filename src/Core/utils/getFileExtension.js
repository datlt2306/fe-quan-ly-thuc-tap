/**
 * @param {File} file
 */
export default function getFileExtension(file) {
	if (!file) return null;

	if (file instanceof File) {
		const fileExtension = file.name.split('.').pop();
		return fileExtension.trim().toLowerCase();
	}
	if (typeof file === 'string') {
		return file.split('.').pop().toLowerCase();
	}
}
