const API_URL = 'https://script.google.com/macros/s/AKfycbznvRVVrBk3cUdgub4WhW1oBsKX3ZisjxxPxqMVPB6mwtrqagn4y8I4sMzQAbApV6jPHA/exec';

document.addEventListener('DOMContentLoaded', function() {
    // Test the API
    console.log('Testing API...');
    
    fetch(API_URL + '?action=logs')
        .then(response => {
            console.log('Response status:', response.status);
            return response.json();
        })
        .then(data => {
            console.log('API Response:', data);
            if (data.success && data.data && data.data.length > 0) {
                console.log('First log entry:', data.data[0]);
                console.log('Fields:', Object.keys(data.data[0]));
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
});