fetch("api.php?action=get_event_averages")
    .then(res => res.json())
    .then(data => console.log(data));
