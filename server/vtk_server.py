r"""
    This module is a VTK Web server application.
    The following command line illustrates how to use it::

        $ vtkpython .../vtk_server.py

    Any VTK Web executable script comes with a set of standard arguments that
    can be overriden if need be::
        --host localhost
             Interface on which the HTTP server will listen.

        --port 8080
             Port number on which the HTTP server will listen.

        --content /path-to-web-content/
             Directory that you want to serve as static web content.
             By default, this variable is empty which means that we rely on another server
             to deliver the static content and the current process only focuses on the
             WebSocket connectivity of clients.

        --authKey wslink-secret
             Secret key that should be provided by the client to allow it to make any
             WebSocket communication. The client will assume if none is given that the
             server expects "wslink-secret" as the secret key.
"""

# import to process args
import sys
import os

# Try handle virtual env if provided
if '--virtual-env' in sys.argv:
  virtualEnvPath = sys.argv[sys.argv.index('--virtual-env') + 1]
  virtualEnv = virtualEnvPath + '/bin/activate_this.py'
  if sys.version_info.major < 3:
    execfile(virtualEnv, dict(__file__=virtualEnv))
  else:
    exec(open(virtualEnv).read(), {'__file__': virtualEnv})

# import vtk modules.
import vtk
from vtk.web import protocols
from vtk.web import wslink as vtk_wslink
from wslink import server

try:
    import argparse
except ImportError:
    # since  Python 2.6 and earlier don't have argparse, we simply provide
    # the source for the same as _argparse and we use it instead.
    from vtk.util import _argparse as argparse

# =============================================================================
# Create custom ServerProtocol class to handle clients requests
# =============================================================================

class _ApplicationServer(vtk_wslink.ServerProtocol):

    # Application configuration
    view    = None
    authKey = "wslink-secret"

    @staticmethod
    def add_arguments(parser):
        parser.add_argument("--virtual-env", default=None, help="Path to virtual environment to use")

    @staticmethod
    def configure(args):
        _ApplicationServer.authKey = args.authKey

    def initialize(self):
        global renderer, renderWindow, renderWindowInteractor, cone, mapper, actor

        # Bring used components
        self.registerVtkWebProtocol(protocols.vtkWebMouseHandler())
        self.registerVtkWebProtocol(protocols.vtkWebViewPort())
        self.registerVtkWebProtocol(protocols.vtkWebPublishImageDelivery(decode=False))
        self.registerVtkWebProtocol(protocols.vtkWebViewPortGeometryDelivery())

        # Update authentication key to use
        self.updateSecret(_ApplicationServer.authKey)

        # tell the C++ web app to use no encoding.
        # ParaViewWebPublishImageDelivery must be set to decode=False to match.
        self.getApplication().SetImageEncoding(0)

        # Create default pipeline (Only once for all the session)
        if not _ApplicationServer.view:
            # VTK specific code
            renderer = vtk.vtkRenderer()
            renderWindow = vtk.vtkRenderWindow()
            renderWindow.AddRenderer(renderer)

            renderWindowInteractor = vtk.vtkRenderWindowInteractor()
            renderWindowInteractor.SetRenderWindow(renderWindow)
            renderWindowInteractor.GetInteractorStyle().SetCurrentStyleToTrackballCamera()

            cone = vtk.vtkConeSource()
            mapper = vtk.vtkPolyDataMapper()
            actor = vtk.vtkActor()

            mapper.SetInputConnection(cone.GetOutputPort())
            actor.SetMapper(mapper)

            renderer.AddActor(actor)
            renderer.ResetCamera()
            renderWindow.Render()

            # VTK Web application specific
            _ApplicationServer.view = renderWindow
            self.getApplication().GetObjectIdMap().SetActiveObject("VIEW", renderWindow)

# =============================================================================
# Main: Parse args and start server
# =============================================================================

if __name__ == "__main__":
    # Create argument parser
    parser = argparse.ArgumentParser(description="VTK/Web web-application")

    # Add arguments:
    # For wslink server:
    server.add_arguments(parser)
    # For our app:
    _ApplicationServer.add_arguments(parser)
    # Extract arguments
    args = parser.parse_args()

    # Configure our current application
    _ApplicationServer.configure(args)

    # Start server
    server.start_webserver(options=args, protocol=_ApplicationServer)
