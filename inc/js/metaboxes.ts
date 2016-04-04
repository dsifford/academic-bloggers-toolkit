declare var wp, ABT_locationInfo;

class PeerReviewMetabox {

	public inputs = {
		authorNames: [] as HTMLInputElement[],
		toggleAuthorResponse: [] as HTMLInputElement[],
		imageButtons: [] as HTMLInputElement[],
	}

	public containers = {
		reviews: [] as HTMLDivElement[],
	}

	public tables = {
		authorResponses: [] as HTMLTableElement[],
	}

	public textareas = {
		reviewContent: [] as HTMLTextAreaElement[],
		responseContent: [] as HTMLTextAreaElement[],
	}

	constructor() {
		this._initFields();
		wp.media.frames.abt_reviewer_photos = [null, null, null, null, null, null];

		this._selectHandler();
		document.getElementById('reviewer_selector').addEventListener('change', this._selectHandler.bind(this));
	}


	private _initFields(): void {

		for (let i = 0; i < 3; i++) {
			this.inputs.authorNames[i] = document.getElementById(`author_name_${i + 1}`) as HTMLInputElement;
			this.inputs.toggleAuthorResponse[i] = document.getElementById(`author_response_button_${i + 1}`) as HTMLInputElement;
			this.inputs.imageButtons[i] = document.getElementById(`headshot_image_button_${i + 1}`) as HTMLInputElement;
			this.inputs.imageButtons[i+3] = document.getElementById(`headshot_image_button_${i+3 + 1}`) as HTMLInputElement;
			this.tables.authorResponses[i] = document.getElementById(`author_response_${i + 1}`) as HTMLTableElement;
			this.textareas.reviewContent[i] = document.getElementById(`peer_review_content_${i + 1}`) as HTMLTextAreaElement;
			this.textareas.responseContent[i] = document.getElementById(`author_content_${i + 1}`) as HTMLTextAreaElement;
			this.containers.reviews[i] = document.getElementById(`tabs-${i + 1}`) as HTMLDivElement

			// Hide empty author response tables
			if (this.inputs.authorNames[i].value === '') {
				this.tables.authorResponses[i].style.display = 'none';
			}

			// Reformat textareas to remove raw HTML
			this.textareas.reviewContent[i].value = this.textareas.reviewContent[i].value
					.replace(/(<br>)|(<br \/>)|(<p>)|(<\/p>)/, "")
					.replace(/(<br>)|(<br \/>)|(<p>)|(<\/p>)/g, "\r");

			this.textareas.responseContent[i].value = this.textareas.responseContent[i].value
					.replace(/(<br>)|(<br \/>)|(<p>)|(<\/p>)/, "")
					.replace(/(<br>)|(<br \/>)|(<p>)|(<\/p>)/g, "\r");

			this.inputs.toggleAuthorResponse[i].addEventListener('click', this._toggleAuthorResponse.bind(this));
			this.inputs.imageButtons[i].addEventListener('click', this._mediaUploadHandler.bind(this))
			this.inputs.imageButtons[i+3].addEventListener('click', this._mediaUploadHandler.bind(this))

		}
	}

	private _selectHandler(e?: Event): void {

		for (let el of this.containers.reviews ) {
			el.style.display = 'none';
		}

		let selectBox = document.getElementById('reviewer_selector') as HTMLSelectElement
    switch (selectBox.value) {
      case '3':
        this.containers.reviews[2].style.display = '';
      case '2':
        this.containers.reviews[1].style.display = '';
      case '1':
        this.containers.reviews[0].style.display = '';
    }
	}

	private _toggleAuthorResponse(e: Event): void {
		let i = parseInt(e.srcElement.id.slice(-1)) - 1;
		let response = this.tables.authorResponses[i];
		response.style.display = response.style.display === 'none' ? '' : 'none';
	}

	private _mediaUploadHandler(e: Event): void {

		let headshotImageInput: HTMLInputElement;
		let i: number = parseInt(e.srcElement.id.slice(-1)) - 1;
		switch (i) {
			case 0:
			case 1:
			case 2:
				headshotImageInput = document.getElementById(`reviewer_headshot_image_${i+1}`) as HTMLInputElement;
				break;
			case 3:
			case 4:
			case 5:
				headshotImageInput = document.getElementById(`author_headshot_image_${i-2}`) as HTMLInputElement;
				break;
		}

		if (wp.media.frames.abt_reviewer_photos[i]) {
			wp.media.frames.abt_reviewer_photos[i].open();
			return;
		}

		wp.media.frames.abt_reviewer_photos[i] = wp.media({
				title: 'Choose or Upload an Image',
				button: { text:  'Use this image' },
				library: { type: 'image' }
		});

		// Runs when an image is selected.
		wp.media.frames.abt_reviewer_photos[i].on('select', function(){

			// Grabs the attachment selection and creates a JSON representation of the model.
			let media_attachment = wp.media.frames.abt_reviewer_photos[i].state().get('selection').first().toJSON();

			// Sends the attachment URL to our custom image input field.
			headshotImageInput.value = media_attachment.url;

		});

		// Opens the media library frame.
		wp.media.frames.abt_reviewer_photos[i].open();


	}

}

if (document.readyState != 'loading'){
	if (ABT_locationInfo.postType !== 'page') { new PeerReviewMetabox; }
} else {
	document.addEventListener('DOMContentLoaded', () => {
		if (ABT_locationInfo.postType !== 'page') { new PeerReviewMetabox }
	});
}
