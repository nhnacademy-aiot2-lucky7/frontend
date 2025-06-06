document.addEventListener("DOMContentLoaded", async () => {
    let departmentId = window.currentUser.department.departmentId

    let json = await fetch(`https://luckyseven.live/api/gateways/department/${departmentId}`)
        .then(response => response.json())
        .catch(error => console.log(error))

    console.log(json)
});
