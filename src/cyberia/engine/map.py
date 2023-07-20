
import os
from PIL import Image
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.colors as mcolors


def plot_color_matrix(matrix):
    # Convert hex colors to RGB colors
    def hex_to_rgb(hex_color):
        return mcolors.to_rgba(hex_color)[:3]

    # Get the number of rows and columns in the matrix
    num_rows = len(matrix)
    num_cols = len(matrix[0])

    # Create a new figure and axis
    fig, ax = plt.subplots()

    # Create an empty matrix to store the RGB colors
    rgb_matrix = np.zeros((num_rows, num_cols, 3))

    # Convert each hex color to RGB and populate the rgb_matrix
    for i in range(num_rows):
        for j in range(num_cols):
            rgb_matrix[i, j] = hex_to_rgb(matrix[i][j])

    # Plot the color grid
    ax.imshow(rgb_matrix)

    # Hide axes ticks and labels
    ax.set_xticks([])
    ax.set_yticks([])
    ax.set_xticklabels([])
    ax.set_yticklabels([])

    # Show the plot
    plt.show()


def extract_hex_colors(image_path):
    print("extract_hex_colors ->", image_path)
    image = Image.open(image_path)
    image_array = np.array(image)
    height, width, _ = image_array.shape
    hex_matrix = []
    for y in range(height):
        hex_matrix_row = []
        for x in range(width):
            r, g, b = image_array[y, x]
            # RGB to HEX
            hex_color = "#{:02x}{:02x}{:02x}".format(r, g, b)
            hex_matrix_row.append(hex_color)

        hex_matrix.append(hex_matrix_row)

    return hex_matrix


def load_images(folder_path):
    for filename in os.listdir(folder_path):
        if filename.endswith('.png') or filename.endswith('.PNG'):
            try:
                hex_matrix = extract_hex_colors(
                    os.path.join(folder_path, filename))
                # print(hex_matrix)
                plot_color_matrix(hex_matrix)
            except Exception as error:
                print("An error occurred:", type(error).__name__,
                      error)  # An error occurred: NameError


load_images("../assets/tiles")
