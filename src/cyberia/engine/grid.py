

import numpy as np
import matplotlib.pyplot as plt
import matplotlib.colors as mcolors

# plt.savefig("mygraph.png")
# plt.show()


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


# Example usage:
color_matrix = [
    ["#FF00FF", "#00FF00", "#0000FF"],
    ["#FFFF00", "#FF0000", "#00FFFF"],
    ["#C0C0C0", "#800080", "#008080"]
]

plot_color_matrix(color_matrix)
