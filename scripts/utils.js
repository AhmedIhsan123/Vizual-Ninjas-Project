// Method to fetch data through a URL and return the data found
export async function fetchData(url) {
    try {
        // Attempt to fetch data from the provided URL
        const response = await fetch(url);

        // Check if the network request was successful (status code 200-299)
        if (!response.ok) {
            // If the response is not OK, throw an error with details
            throw new Error(`Failed to fetch from ${url}: ${response.statusText}`);
        }

        // Parse the response body as JSON and return it
        return await response.json();
    } catch (error) {
        // Catch any errors that occur during the fetch operation or JSON parsing
        console.error("Fetch error: ", error); // Log the error to the console
        throw error; // Re-throw the error so it can be handled by the calling function
    }
}