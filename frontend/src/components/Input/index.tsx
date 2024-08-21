import styled from 'styled-components';

interface StyledInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 10px 0;
`;

const StyledLabel = styled.label`
  font-size: 14px;
  color: #fff;
  margin-bottom: 5px;
`;

const StyledInput = styled.input`
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;

  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const StyledInputComponent: React.FC<StyledInputProps> = ({ label, ...props }) => {
  return (
    <InputContainer>
      {label && <StyledLabel>{label}</StyledLabel>}
      <StyledInput {...props} />
    </InputContainer>
  );
};

export default StyledInputComponent;
