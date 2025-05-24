// Method to fetch data through url and return the data found
export async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch from ${url}: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Fetch error: ", error);
        throw error; // Re-throw the error
    }
}