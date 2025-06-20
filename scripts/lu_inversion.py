#!/usr/bin/env python3
import json
import sys
import numpy as np
from scipy.linalg import lu, solve_triangular
import time
import multiprocessing as mp
import warnings

# Suppress warnings for cleaner output
warnings.filterwarnings('ignore')

def serial_lu_inverse(A):
    """LU-based matrix inversion using np.linalg.inv() for L and U."""
    P, L, U = lu(A)
    try:
        inv_L = np.linalg.inv(L)
        inv_U = np.linalg.inv(U)
        inv_A = inv_U @ inv_L @ P.T
        return inv_A
    except np.linalg.LinAlgError:
        raise ValueError("Matrix L or U is singular.")

def parallel_worker(args):
    """Worker function for parallel computation of a chunk of columns."""
    L, U, P, start_idx, end_idx, eye = args
    inv_chunk = np.zeros((L.shape[0], end_idx - start_idx))
    for i in range(start_idx, end_idx):
        b = eye[:, i]
        y = solve_triangular(L, np.dot(P.T, b), lower=True, unit_diagonal=True)
        x = solve_triangular(U, y, lower=False)
        inv_chunk[:, i - start_idx] = x
    return start_idx, inv_chunk

def parallel_lu_inverse(A):
    """Compute matrix inverse using LU decomposition in parallel with dynamic chunking."""
    n = A.shape[0]
    P, L, U = lu(A)
    inv_A = np.zeros((n, n))
    eye = np.eye(n)

    # Dynamic process and chunk size based on matrix size
    if n < 1500:  # Threshold where parallel overhead might not be worth it
        num_processes = 1
        chunk_size = n
    else:
        num_processes = max(2, mp.cpu_count() // 2)  # Half CPU cores or at least 2
        chunk_size = max(10, n // (num_processes * 2))  # Larger chunks for better efficiency

    if num_processes == 1:
        return serial_lu_inverse(A)

    with mp.Pool(processes=num_processes) as pool:
        tasks = [(L, U, P, i, min(i + chunk_size, n), eye) for i in range(0, n, chunk_size)]
        results = [pool.apply_async(parallel_worker, args=(task,)) for task in tasks]
        for result in results:
            start_idx, chunk = result.get()
            inv_A[:, start_idx:start_idx + chunk.shape[1]] = chunk

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
        method = input_data.get('method', 'LU Decomposition')
        
        # Validate input
        if not isinstance(matrix_size, int) or matrix_size <= 0:
            raise ValueError("Invalid matrix size")
            
        if len(matrix_elements) != matrix_size * matrix_size:
            raise ValueError(f"Expected {matrix_size * matrix_size} elements, got {len(matrix_elements)}")
        
        # Create matrix
        A = np.array(matrix_elements, dtype=float).reshape(matrix_size, matrix_size)
        
        try:
            # Serial computation
            start_time_serial = time.perf_counter()
            inv_A_serial = serial_lu_inverse(A)
            end_time_serial = time.perf_counter()
            serial_time = end_time_serial - start_time_serial

            # Parallel computation
            start_time_parallel = time.perf_counter()
            inv_A_parallel = parallel_lu_inverse(A)
            end_time_parallel = time.perf_counter()
            parallel_time = end_time_parallel - start_time_parallel

            # Verify results are consistent
            if not np.allclose(inv_A_serial, inv_A_parallel):
                raise ValueError("Serial and parallel results differ!")

            # Return results
            result = {
                'inverse_matrix': inv_A_serial.tolist(),
                'serial_time': float(serial_time),
                'parallel_time': float(parallel_time),
                'method': method,
                'matrix_size': int(matrix_size)
            }
            
            # Output only JSON
            print(json.dumps(result))
            
        except np.linalg.LinAlgError:
            raise ValueError("Matrix is singular or not invertible")
            
    except Exception as e:
        error_result = {
            'error': str(e)
        }
        print(json.dumps(error_result))
        sys.exit(1)

if __name__ == "__main__":
    main()
