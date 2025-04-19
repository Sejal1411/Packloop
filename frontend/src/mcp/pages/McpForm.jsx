import React from 'react';
import { TextField, Button, Stack, Typography, Container, InputLabel, Box } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

// Reusable FormField Component
const FormField = ({ label, name, type = "text", register, validation, error, helperText }) => (
  <TextField
    label={label}
    type={type}
    {...register(name, validation)} // Correctly pass name and validation
    error={!!error}
    helperText={helperText}
    fullWidth
  />
);

const McpForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    try {
      const res = await fetch("http://localhost:5000/api/auth/mcp/register", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (res.ok) {
        console.log("Registered successfully:", result);
        localStorage.setItem("token", result.token);
        navigate('/mcp/dashboard');
      } else {
        console.error("Registration error:", result.message);
      }
    } catch (err) {
      console.error("Something went wrong:", err);
    }
  };

  // Form fields configuration
  const fields = [
    { label: "Full Name", name: "name", validation: { required: "Name is required" } },
    { label: "Email", name: "email", type: "email", validation: { required: "Email is required" } },
    { label: "Educational Qualifications", name: "education", validation: { required: "This field is required" } },
    { label: "Password", name: "password", type: "password", validation: { 
        required: "Password is required", 
        minLength: { value: 6, message: "Password must be at least 6 characters long" } 
      } 
    },
    { label: "Confirm Password", name: "confirmPassword", type: "password", validation: { 
        required: "Confirm Password is required", 
        validate: (value, { password }) => value === password || "Passwords do not match" 
      } 
    },
  ];

  return (
    <Container maxWidth="sm">
      <Box mt={5}>
        <Typography variant="h4" align="center" gutterBottom>
          MCP Registration Form
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
          <Stack spacing={3} mt={3}>
            {fields.map((field) => (
              <FormField
                key={field.name}
                label={field.label}
                name={field.name} // Pass the name to FormField
                type={field.type}
                register={register} // Pass the register function
                validation={field.validation}
                error={errors[field.name]}
                helperText={errors[field.name]?.message}
              />
            ))}

            <div>
              <InputLabel>Aadhar Card (PDF or Image)</InputLabel>
              <input
                type="file"
                accept="image/*,.pdf"
                {...register("aadhar", { required: "Please upload your Aadhar card" })}
              />
              {errors.aadhar && (
                <Typography color="error" variant="caption">
                  {errors.aadhar.message}
                </Typography>
              )}
            </div>

            <Button type="submit" variant="contained" fullWidth>
              Submit for Approval
            </Button>
          </Stack>
        </form>
      </Box>
    </Container>
  );
};

export default McpForm;