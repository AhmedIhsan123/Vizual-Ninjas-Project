// Method to fetch data through url and return the data found
export async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Network response was not ok " + response.statusText);
        }
        return await response.json();
    } catch (error) {
        return console.error("Fetch error: ", error);
    }
}