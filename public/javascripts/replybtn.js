const buttons = document.querySelectorAll(".reply-button");
buttons.forEach((button, i) => {
	button.addEventListener("click", () => {
		console.log(campground.reviews[i]);
		const reviewCard = document.querySelector(`#review-${i}`);
		const form = document.createElement("form");
		form.action = `/campgrounds/${campground._id}/reviews/${campground.reviews[i]._id}`;
		form.method = "POST";
		const input = document.createElement("input");
		const addButton = document.createElement("button");
		addButton.innerText = "Add";
		input.type = "text";
		input.name = "replyBody";
		form.appendChild(input);
		form.appendChild(addButton);
		reviewCard.appendChild(form);
		// form.appendChild(ele);
	});
});
