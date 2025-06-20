# Matrix Inversion Web Application

[![GitHub](https://img.shields.io/github/license/abdulmanan093/Matrix-Inversion)](https://github.com/abdulmanan093/Matrix-Inversion)
[![GitHub stars](https://img.shields.io/github/stars/abdulmanan093/Matrix-Inversion)](https://github.com/abdulmanan093/Matrix-Inversion/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/abdulmanan093/Matrix-Inversion)](https://github.com/abdulmanan093/Matrix-Inversion/issues)

This is a web application that performs matrix inversion using both Gaussian Elimination and LU Decomposition methods. The application provides a modern UI interface and supports parallel processing for large matrices.

## Features

- Matrix inversion using two methods:
  - Gaussian Elimination
  - LU Decomposition
- Parallel processing for improved performance on large matrices
- Real-time performance metrics
- Modern, responsive user interface
- Support for matrices up to 5000×5000

## Prerequisites

- Node.js (v18 or higher)
- Python 3.8 or higher
- npm or pnpm package manager

## Required Python Packages

```bash
numpy
scipy
```

## Installation

1. Clone the repository:

```bash
git clone https://github.com/abdulmanan093/Matrix-Inversion.git
cd Matrix-Inversion
```

2. Install Python dependencies:

```bash
pip install numpy scipy
# or run
pip install -r requirements.txt

```

3. Install Node.js dependencies:

```bash
# Using npm
npm install

# Or if it create an error use 
npm install --legacy-peer-deps
```

## Running the Application

1. Start the development server:

```bash
# Using npm
npm run dev

```

2. Open your browser and navigate to:

```
http://localhost:3000
```

## Project Structure

```
matrix-inversion-app/
├── app/                    # Next.js application files
│   ├── api/               # API routes
│   │   ├── compute-inverse/
│   │   └── generate-matrix/
│   ├── calculator/        # Matrix calculator page
│   └── page.tsx          # Home page
├── scripts/               # Python computation scripts
│   ├── gauss_inversion.py
│   └── lu_inversion.py
└── components/            # React components
```

## Usage

1. Navigate to the calculator page
2. Select the matrix inversion method (Gaussian Elimination or LU Decomposition)
3. Enter the matrix size (up to 5000×5000)
4. Choose to either:
   - Generate a random matrix
   - Input your own matrix elements
5. Click "Calculate Inverse" to perform the inversion

The application will display:

- The inverted matrix
- Serial computation time
- Parallel computation time
- Performance improvement metrics

## Performance Notes

- Parallel processing is automatically used for matrices larger than 1500×1500
- For smaller matrices, serial computation is used to avoid parallel overhead
- Performance metrics show actual speedup or indicate when parallel processing is slower

## Troubleshooting

1. If you encounter Python path issues:

   - Ensure Python is in your system PATH
   - Use the full Python path in the API routes if needed

2. For memory issues with large matrices:

   - Ensure sufficient system RAM is available
   - Consider reducing the matrix size

3. For performance issues:
   - Check system CPU usage
   - Ensure no other resource-intensive processes are running

## Development

To modify the computation methods:

1. Edit the Python scripts in the `scripts/` directory
2. The API routes in `app/api/` handle the communication between frontend and Python scripts
3. The calculator page in `app/calculator/` contains the UI logic

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


## Repository

View the source code on [GitHub](https://github.com/abdulmanan093/Matrix-Inversion)
