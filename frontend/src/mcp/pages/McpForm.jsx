import React from 'react';
import {TextField, Button, Stack,
  Typography, Container, InputLabel, Box
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

const McpForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  
  const onSubmit = (data) => {
    console.log("Form Data Submitted:", data);
    // TODO: send data to backend (maybe with file handling)

    navigate('/mcp/dashboard');
  };

  return (
    <Container maxWidth="sm">
      <Box mt={5}>
        <Typography variant="h4" align="center" gutterBottom>
          MCP Registration Form
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
          <Stack spacing={3} mt={3}>
            <TextField
              label="Full Name"
              {...register("name", { required: "Name is required" })}
              error={!!errors.name}
              helperText={errors.name?.message}
              fullWidth
            />

            <TextField
              label="Email"
              type="email"
              {...register("email", { required: "Email is required" })}
              error={!!errors.email}
              helperText={errors.email?.message}
              fullWidth
            />

            <TextField
              label="Contact Number"
              {...register("contact", {
                required: "Contact number is required",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Enter a valid 10-digit number"
                }
              })}
              error={!!errors.contact}
              helperText={errors.contact?.message}
              fullWidth
            />

            <TextField
              label="Educational Qualifications"
              {...register("education", { required: "This field is required" })}
              error={!!errors.education}
              helperText={errors.education?.message}
              fullWidth
            />

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
