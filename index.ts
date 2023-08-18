import * as fs from 'fs';
import Table from 'cli-table3';

// Read the log data from the provided text
const logData: string = fs.readFileSync('log_data.txt', 'utf-8');

// Split the log data into individual lines
const logLines: string[] = logData.split('\n');

// Initialize data structures
const endpointCounts: { [key: string]: number } = {};
const minuteCounts: { [key: string]: number } = {};
const statusCodeCounts: { [key: string]: number } = {};

// Process each log line
logLines.forEach((line: string) => {
    const match = line.match(/\[(\d{2}\/[A-Za-z]{3}\/\d{4}:\d{2}:\d{2}:\d{2} \+\d{4})\].*?"([A-Z]+) (.+?) HTTP/);
    if (!match) return; // Ignore lines that don't match the format
    const timestamp: string = match[1];
    const method: string = match[2];
    const endpoint: string = match[3];
    
    const statusCodeMatch = line.match(/\d{3} (\d+)/);
    if (!statusCodeMatch) return; // Ignore lines that don't contain status code information
    const statusCode: string = statusCodeMatch[1];

    // Count endpoint calls
    const endpointKey: string = `${method} ${endpoint}`;
    endpointCounts[endpointKey] = (endpointCounts[endpointKey] || 0) + 1;

    // Count API calls per minute
    const minuteKey: string = timestamp.split(':')[0];
    minuteCounts[minuteKey] = (minuteCounts[minuteKey] || 0) + 1;

    // Count API calls per status code
    statusCodeCounts[statusCode] = (statusCodeCounts[statusCode] || 0) + 1;
});

// Create a table for endpoint counts
const endpointTable = new Table({
    head: ['Method', 'Endpoint', 'Count'],
});
for (const endpoint in endpointCounts) {
    const [method, path] = endpoint.split(' ');
    endpointTable.push([method, path, endpointCounts[endpoint]]);
}

// Create a table for API calls per minute
const minuteTable = new Table({
    head: ['Minute', 'Count'],
});
for (const minute in minuteCounts) {
    minuteTable.push([minute, minuteCounts[minute]]);
}

// Create a table for API calls per status code
const statusCodeTable = new Table({
    head: ['Status Code', 'Count'],
    colWidths: [15, 10], // Set specific column width for status code
});
for (const statusCode in statusCodeCounts) {
    statusCodeTable.push([statusCode, statusCodeCounts[statusCode]]);
}

// Log the tables
// console.log('Endpoint Counts:');
// console.log(endpointTable.toString());
// console.log('\nAPI Calls Per Minute:');
// console.log(minuteTable.toString());
console.log('\nAPI Calls Per Status Code:');
console.log(statusCodeTable.toString());

console.log('Analysis results logged.');
