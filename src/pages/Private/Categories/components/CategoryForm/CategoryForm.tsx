import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { dialogCloseSubject$ } from "@/components/CustomDialog";
import FooterCustomDialog from "@/components/FooterCustomDialog/FooterCustomDialog";
import { useSnackbar } from "@/context/SnackbarContext";
import { CategoryFormData, categorySchema } from "@/models/category";
import { useCreateCategoryMutation } from "@/services/categoriesApi";
import { Box, TextField } from "@mui/material";

export default function CategoryForm() {
  const [create, { isLoading }] = useCreateCategoryMutation();
  const snackbar = useSnackbar();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
  });

  const onSubmit = async (data: CategoryFormData) => {
    try {
      const newCategory = await create(data).unwrap();
      dialogCloseSubject$.setSubject = false;
      snackbar.openSnackbar(`Categoría ${newCategory.name} creada con éxito`);
    } catch (e) {
      //console.log(e);
      snackbar.openSnackbar(`${e.data.error}`, "error");
    }
  };

  return (
    <>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <TextField
          label="Nombre de la categoría"
          {...register("name")}
          error={!!errors.name}
          helperText={errors.name?.message}
        />
        <TextField
          label="Descripción"
          {...register("description")}
          error={!!errors.description}
          helperText={errors.description?.message}
        />
        <FooterCustomDialog
          isLoading={isLoading}
          onClose={() => {}}
          editMode={false}
        />
      </Box>
    </>
  );
}
