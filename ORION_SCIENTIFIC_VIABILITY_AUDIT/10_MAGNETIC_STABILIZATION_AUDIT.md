# Magnetic-Stabilization Audit

Static permanent-magnet attraction/repulsion does not generally provide stable
equilibrium in all translational and rotational directions; practical passive
magnetic bearings require constraints, diamagnetism, superconductors or dynamic
effects. Superconducting magnetic-bearing reviews explicitly distinguish these
exceptions from ordinary static passive systems
([Supreeth et al.](https://doi.org/10.1109/TASC.2022.3156813)).

Even where magnets provide a restoring torque or unload a bearing, they add field
gradients, nonlinearity, hysteresis and cross-axis coupling. Conductive structures
may provide eddy-current damping, but damping and stiffness must be measured, not
called “stabilization” from a visual.

Magnetic stabilization is directly hostile to onboard magnetic heading. The
permanent magnetic needle, steel, brass/aluminium assembly tolerances, currents
and nearby magnets produce hard-/soft-iron and platform fields. Established
magnetometer calibration explicitly models hard iron, soft iron, bias,
non-orthogonality and related distortions
([Alonso & Shuster](https://doi.org/10.3182/20080408-3-IE-4914.00031)). A changing
actuation field cannot be removed by one static calibration.

Verdict:

- passive magnetic stabilization is not scientifically justified for the MVP;
- magnetic sensing is not compatible with the current magnetic needle/stabilizer
  as a clean independent channel;
- use a conventional rotary stage/bearing for the bench setup;
- later choose either a magnetically clean heading experiment or a separately
  characterized magnetic actuator with external nonmagnetic reference—not both by
  default.

