import React from 'react';
import { FormKit } from '@jiin.seok/formkit-react';

function TestApp() {
  const handleSubmit = (data) => {
    console.log('Form submitted:', data);
    alert('Form submitted! Check console for data.');
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '500px', margin: '0 auto' }}>
      <h1>FormKit React Test</h1>
      
      <FormKit.Root formId="test-form" onSubmit={handleSubmit}>
        <FormKit.Title>Test Form</FormKit.Title>
        
        <FormKit.Field>
          <FormKit.Label>Name</FormKit.Label>
          <FormKit.Input 
            name="name" 
            placeholder="Enter your name"
            required 
          />
        </FormKit.Field>
        
        <FormKit.Field>
          <FormKit.Label>Email</FormKit.Label>
          <FormKit.Input 
            name="email" 
            type="email"
            placeholder="your@email.com"
            required 
          />
        </FormKit.Field>
        
        <FormKit.Field>
          <FormKit.Label>Password</FormKit.Label>
          <FormKit.Input 
            name="password" 
            type="password"
            placeholder="Enter password"
            required 
          />
        </FormKit.Field>
        
        <FormKit.Field>
          <FormKit.Label>Country</FormKit.Label>
          <FormKit.Select 
            name="country"
            options={[
              { value: 'us', label: 'United States' },
              { value: 'kr', label: 'South Korea' },
              { value: 'uk', label: 'United Kingdom' },
            ]}
            placeholder="Select your country"
            required
          />
        </FormKit.Field>
        
        <FormKit.Field>
          <FormKit.Label>Bio</FormKit.Label>
          <FormKit.Textarea 
            name="bio"
            placeholder="Tell us about yourself"
          />
        </FormKit.Field>
        
        <FormKit.SubmitButton>
          Submit Form
        </FormKit.SubmitButton>
      </FormKit.Root>
    </div>
  );
}

export default TestApp;