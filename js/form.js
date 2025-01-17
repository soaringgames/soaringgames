window.onload = function () {
    document.getElementById('contactForm').addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent default form submission

        const firstName = document.getElementById('firstName').value;
        const email = document.getElementById('emailAddress').value;

        // Use HubSpot form loader to submit the data
        hbspt.forms.create({
            portalId: "48879583",
            formId: "b28c1a20-0a8b-4534-8c7a-402d4338fac5",
            onFormReady: function (formElement) {
                // Access the form using `formElement`
                formElement.querySelector('input[name="firstname"]').value = firstName;
                formElement.querySelector('input[name="email"]').value = email;

                // Submit the form
                formElement.submit();
            },
            onFormSubmitted: function () {
                console.log("Form successfully submitted!");
                document.getElementById('successMessage').style.display = 'block';
                document.getElementById('errorMessage').style.display = 'none';
            }
        });
    });
};