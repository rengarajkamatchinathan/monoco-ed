import React, { useState } from 'react';
import PromptPage from './components/PromptPage';
import IDE from './components/IDE';
import { mockTerraformData } from './data/mockData';
import Terminal from './components/Terminal';

function App() {
  const [terraformData, setTerraformData] = useState<any>(null);

  

  const handleTerraformGenerated = (data: any) => {
    setTerraformData(data);
  };

  const handleBackToPrompt = () => {
    setTerraformData(null);
  };

  return (
    <>
      {!terraformData ? (
        <PromptPage onTerraformGenerated={handleTerraformGenerated} />
      ) : (
        <IDE terraformData={mockTerraformData} onBackToPrompt={handleBackToPrompt} />
       )}

      {/* Test Mock Data */}
      {/* <IDE terraformData={mockTerraformData} onBackToPrompt={handleBackToPrompt} /> */}
    </>
  );
}

export default App;