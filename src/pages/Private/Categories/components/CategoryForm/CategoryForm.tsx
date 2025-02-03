import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";

import { Box, Button, TextField } from "@mui/material";
import { CategoryFormData, categorySchema } from "@/models/category";

const CategoryForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful, isLoading },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
  });

  const onSubmit = (data: CategoryFormData) => {
    if (isSubmitSuccessful) {
      console.log(data);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
    >
      <TextField
        label="Nombre de la categoría"
        {...register("categoryName")}
        error={!!errors.categoryName}
        helperText={errors.categoryName?.message}
      />
      <TextField
        label="Descripción"
        {...register("description")}
        error={!!errors.description}
        helperText={errors.description?.message}
      />
      <Button
        sx={{ mt: 2, width: "fit-content", alignSelf: "flex-end" }}
        type="submit"
        variant="contained"
        color="primary"
        loading={isLoading}
        loadingPosition="end"
      >
        Agregar
      </Button>
    </Box>
  );
};

export default CategoryForm;
