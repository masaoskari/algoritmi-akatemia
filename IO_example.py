# Test inputs
predefined_inputs = ["2", "matti"]
input_index = 0

def mock_input(prompt=None):
    global input_index
    if input_index < len(predefined_inputs):
        response = predefined_inputs[input_index]
        input_index += 1
        print(f"{prompt}{response}")  # Simulate the user seeing the prompt and entering the response
        return response
    else:
        raise Exception("No more predefined inputs available.")

# Redefine the input function to use mock_input
__builtins__.input = mock_input

# Student code
ika = int(input("Anna ikäsi: "))
nimi = input("Anna nimesi: ")
print("Hei,", nimi, "olet", ika, "vuotta vanha.")