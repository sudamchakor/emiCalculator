import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import BasicInfoDisplay from "./BasicInfoDisplay";

describe("BasicInfoDisplay Component", () => {
  const defaultProps = {
    currentAge: 30,
    retirementAge: 60,
    onEdit: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the current age and retirement age correctly", () => {
    render(<BasicInfoDisplay {...defaultProps} />);
    
    expect(screen.getByText("30 years")).toBeInTheDocument();
    expect(screen.getByText("60 years")).toBeInTheDocument();
  });

  it("calculates and displays the correct years to retirement", () => {
    render(<BasicInfoDisplay {...defaultProps} />);
    
    // 60 - 30 = 30 years
    // There will be two "30 years" on the screen (one for current age, one for years to retirement)
    expect(screen.getAllByText("30 years").length).toBe(2);
  });

  it("calls onEdit when the edit icon button is clicked", () => {
    render(<BasicInfoDisplay {...defaultProps} />);
    
    const editButton = screen.getByRole("button");
    fireEvent.click(editButton);
    
    expect(defaultProps.onEdit).toHaveBeenCalledTimes(1);
  });
});