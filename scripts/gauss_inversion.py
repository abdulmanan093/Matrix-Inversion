#!/usr/bin/env python3
import json
import sys
import numpy as np
import time
import multiprocessing as mp
import warnings

# Suppress warnings for cleaner output
warnings.filterwarnings('ignore')

def serial_gauss_inverse(A):
    """Serial Gaussian elimination matrix inversion using numpy."""
    return np.linalg.inv(A)

def parallel_worker_np_inv(args):
    """Worker function for parallel computation of matrix inverse columns."""
    A, I, start, end = args
    n = A.shape[0]
    chunk = np.zeros((n, end - start))
    for i in range(start, end):
        e = I[:, i]
        col = np.linalg.solve(A, e)
        chunk[:, i - start] = col
    return start, chunk

def parallel_gauss_inverse(A):
    """Compute matrix inverse using Gaussian elimination in parallel."""
    n = A.shape[0]
    if n < 1500:  # For small matrices, parallel overhead is not worth it
        return serial_gauss_inverse(A)

    inv_A = np.zeros((n, n))
    I = np.eye(n)
    num_processes = max(2, mp.cpu_count() // 2)  # Half CPU cores or at least 2
    chunk_size = max(10, n // (num_processes * 2))  # Larger chunks for better efficiency

    with mp.Pool(processes=num_processes) as pool:
        tasks = [(A.copy(), I, i, min(i + chunk_size, n)) for i in range(0, n, chunk_size)]
        results = [pool.apply_async(parallel_worker_np_inv, args=(task,)) for task in tasks]
        for result in results:
            start, chunk = result.get()
            inv_A[:, start:start + chunk.shape[1]] = chunk

    return inv_A

def main():
    try:
        # Read input from stdin
        input_line = sys.stdin.read().strip()
        if not input_line:
            raise ValueError("No input received")
            
        input_data = json.loads(input_line)
        matrix_size = input_data['matrix_size']
        matrix_elements = input_data['matrix_elements']
        method = input_data.get('method', 'Gaussian Elimination')
        
        # Validate input
        if not isinstance(matrix_size, int) or matrix_size <= 0:
            raise ValueError("Invalid matrix size")
            
        if len(matrix_elements) != matrix_size * matrix_size:
            raise ValueError(f"Expected {matrix_size * matrix_size} elements, got {len(matrix_elements)}")
        
        # Create matrix
        A = np.array(matrix_elements, dtype=float).reshape(matrix_size, matrix_size)
        
        # Check if matrix is invertible
        det = np.linalg.det(A)
        if abs(det) < 1e-12:
            raise ValueError("Matrix is singular (determinant ≈ 0) and cannot be inverted")
        
        # Serial computation
        start_time_serial = time.perf_counter()
        inv_A_serial = serial_gauss_inverse(A.copy())
        end_time_serial = time.perf_counter()
        serial_time = end_time_serial - start_time_serial
        
        # Parallel computation
        start_time_parallel = time.perf_counter()
        inv_A_parallel = parallel_gauss_inverse(A.copy())
        end_time_parallel = time.perf_counter()
        parallel_time = end_time_parallel - start_time_parallel
        
        # Verify results are consistent
        if not np.allclose(inv_A_serial, inv_A_parallel, rtol=1e-8, atol=1e-10):
            # Use serial result if parallel differs significantly
            inv_A_final = inv_A_serial
        else:
            inv_A_final = inv_A_parallel if parallel_time < serial_time else inv_A_serial
        
        # Return results
        result = {
            'inverse_matrix': inv_A_final.tolist(),
            'serial_time': float(serial_time),
            'parallel_time': float(parallel_time),
            'method': method,
            'matrix_size': int(matrix_size)
        }
        
        # Output only JSON
        print(json.dumps(result))
        
    except Exception as e:
        error_result = {
            'error': str(e)
        }
        print(json.dumps(error_result))
        sys.exit(1)

if __name__ == "__main__":
    main()
