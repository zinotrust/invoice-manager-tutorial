"use server";

import { MailApiDev } from "mailapidev";

const mailapi = new MailApiDev(process.env.MAILAPI_KEY);

// send email
export const sendEmail = async (emailData) => {
  try {
    const { data, error } = await mailapi.emails.send(emailData);

    if (error) {
      return {
        success: false,
        error: error.message || "Failed to send email",
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Failed to send email",
    };
  }
};

// verify email
export const verifyEmail = async (email) => {
  try {
    const { data, error } = await mailapi.emails.verify({
      email,
    });

    if (error) {
      return {
        success: false,
        error: error.message || "Failed to send email",
      };
    }
    console.log("Email verified", data);
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Failed to send email",
    };
  }
};

// add email to mailapi
export const addEmailToMailAPI = async (emailData) => {
  try {
    const { data, error } = await mailapi.emails.add(emailData);

    if (error) {
      return {
        success: false,
        error: error.message || "Failed to add email",
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Failed to send email",
    };
  }
};

// update email in mailapi
export const updateMailAPIEmail = async (emailData) => {
  try {
    const { data, error } = await mailapi.emails.update(emailData);

    if (error) {
      return {
        success: false,
        error: error.message || "Failed to update email",
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Failed to send email",
    };
  }
};
