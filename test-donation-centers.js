// Simple test script to verify donation centers API
// Run this in browser console or as a standalone script

const API_BASE_URL = 'http://localhost:5000'; // Change to your backend URL

async function testDonationCenters() {
  console.log('🧪 Testing Donation Centers API...');
  
  try {
    // Test 1: Get all centers
    console.log('\n📍 Test 1: Getting all donation centers');
    const response = await fetch(`${API_BASE_URL}/api/donation-centers`);
    const data = await response.json();
    
    if (data.success) {
      console.log(`✅ Found ${data.count} donation centers:`);
      data.data.forEach((center, index) => {
        console.log(`${index + 1}. ${center.name}`);
        console.log(`   📍 ${center.address.fullAddress}`);
        console.log(`   🩸 Blood Types: ${center.bloodTypesAccepted.join(', ')}`);
        console.log(`   ⭐ Rating: ${center.rating.average}/5 (${center.rating.count} reviews)`);
        console.log(`   📞 Phone: ${center.contact.phone || 'N/A'}`);
        console.log(`   🌐 Website: ${center.contact.website || 'N/A'}`);
        console.log(`   🕒 Status: ${center.status}`);
        console.log('   ---');
      });
    } else {
      console.error('❌ Failed to fetch centers:', data.message);
    }
    
    // Test 2: Get centers near NYC
    console.log('\n🗽 Test 2: Getting centers near NYC (40.7128, -74.0060)');
    const nycResponse = await fetch(`${API_BASE_URL}/api/donation-centers?latitude=40.7128&longitude=-74.0060&radius=25`);
    const nycData = await nycResponse.json();
    
    if (nycData.success) {
      console.log(`✅ Found ${nycData.count} centers near NYC:`);
      nycData.data.forEach((center, index) => {
        console.log(`${index + 1}. ${center.name} - ${center.address.city}, ${center.address.state}`);
      });
    } else {
      console.error('❌ Failed to fetch NYC centers:', nycData.message);
    }
    
    // Test 3: Filter by blood type
    console.log('\n🩸 Test 3: Getting centers that accept A+ blood');
    const bloodResponse = await fetch(`${API_BASE_URL}/api/donation-centers?bloodType=A+`);
    const bloodData = await bloodResponse.json();
    
    if (bloodData.success) {
      console.log(`✅ Found ${bloodData.count} centers accepting A+ blood:`);
      bloodData.data.forEach((center, index) => {
        console.log(`${index + 1}. ${center.name}`);
      });
    } else {
      console.error('❌ Failed to fetch A+ centers:', bloodData.message);
    }
    
    // Test 4: Calculate route (if we have centers)
    if (data.success && data.data.length > 0) {
      console.log('\n🗺️ Test 4: Calculating route to first center');
      const firstCenter = data.data[0];
      const routeResponse = await fetch(`${API_BASE_URL}/api/donation-centers/routes/calculate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originLat: 40.7128, // NYC
          originLng: -74.0060,
          destinationLat: firstCenter.location.coordinates[1],
          destinationLng: firstCenter.location.coordinates[0],
          travelMode: 'DRIVE'
        })
      });
      
      const routeData = await routeResponse.json();
      
      if (routeData.success) {
        console.log(`✅ Route calculated to ${firstCenter.name}:`);
        console.log(`   🚗 Duration: ${routeData.data.duration}`);
        console.log(`   📏 Distance: ${routeData.data.distance} meters`);
      } else {
        console.error('❌ Failed to calculate route:', routeData.message);
      }
    }
    
    console.log('\n🎉 Test completed!');
    
  } catch (error) {
    console.error('❌ Test failed with error:', error);
    console.log('\n💡 Make sure:');
    console.log('   1. Backend server is running on port 5000');
    console.log('   2. MongoDB is connected');
    console.log('   3. You have run: npm run seed-centers');
    console.log('   4. Google Maps API key is configured');
  }
}

// Run the test
testDonationCenters();
