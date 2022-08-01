import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import MobileStepper from "@mui/material/MobileStepper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import { useState } from "react";
import { useForm } from "react-hook-form";
import SignupFormDetails from "./SignupFormDetails";
import SignupFormCredentials from "./SignupFormCredentials";
import { Stack } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useNavigate } from "react-router-dom";
import SignupFormPicture from "./SignupFormPicture";
import defaultProfileImg from "../common/defaultProfileImg";

function SignupForm({signup}) {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  function goHome() {
    navigate(`/`);
  }

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, touchedFields, isValid },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      birthDate: "",
      city: "",
      state: "",
      phoneNumber: null,
      password: "",
      confirmPassword: "",
      email: "",
      profileImg: defaultProfileImg,
    },
    mode: "onTouched",
  });

  const steps = [
    {
      label: "Provide Player Details",
      component: (
        <SignupFormDetails
          control={control}
          errors={errors}
        />
      ),
    },
    {
      label: "Provide Credentials",
      component: (
        <SignupFormCredentials
          control={control}
          errors={errors}
          getValues={getValues}
        />
      ),
    },
    {
      label: "Upload Profile Picture",
      component: <SignupFormPicture signup={signup} getValues={getValues} setValue={setValue} setActiveStep={setActiveStep} handleSubmit={handleSubmit} />,
    },
  ];

  const maxSteps = steps.length;

  const handleEnableNextStep = () => {
    if (activeStep === 0) {
      const { firstName, lastName, email, city, state } = touchedFields;
      if (firstName && lastName && email && city && state && isValid)
        return false;
      return true;
    } else if (activeStep === 1) {
      const { username, password, confirmPassword } = touchedFields;
      if (username && password && confirmPassword && isValid) return false;
      return true;
    }
  };
  const {phoneNumber} = getValues()
  console.log(phoneNumber)
  return (
    <Stack>
      <Box
        sx={{
          display: "inline-flex",
          backgroundColor: "#F24346",
          position: "fixed",
          top: "3.5rem",
          zIndex: "10",
          width: "100%",
          boxShadow: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Button
            sx={{ color: "#FFFFFF", marginX: 1 }}
            startIcon={<ArrowBackIosIcon />}
            onClick={goHome}
          >
            Home
          </Button>
        </Box>
        <Box>
          <Typography sx={{ fontSize: 20, padding: 1, color: "#FFFFFF" }}>
            {steps[activeStep].label}
          </Typography>
        </Box>
      </Box>
      <Stack
        component="form"
        sx={{
          marginTop: 7,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 10,
        }}
      >
        {steps[activeStep].component}
      </Stack>

      <MobileStepper
        variant="text"
        steps={maxSteps}
        sx={{
          positin: "fixed",
          bottom: "4.5rem",
          backgroundColor: "#E5383B",
          color: "#FFFFFF",
        }}
        activeStep={activeStep}
        nextButton={
          <Button
            size="small"
            onClick={handleNext}
            sx={{ color: "#FFFFFF" }}
            disabled={(activeStep === maxSteps - 1) || handleEnableNextStep()}
          >
            Next
            {theme.direction === "rtl" ? (
              <KeyboardArrowLeft />
            ) : (
              <KeyboardArrowRight />
            )}
          </Button>
        }
        backButton={
          <Button
            size="small"
            sx={{ color: "#FFFFFF" }}
            onClick={handleBack}
            disabled={activeStep === 0}
          >
            {theme.direction === "rtl" ? (
              <KeyboardArrowRight />
            ) : (
              <KeyboardArrowLeft />
            )}
            Back
          </Button>
        }
      />
    </Stack>
  );
}

export default SignupForm;
