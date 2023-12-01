package pns.project.z.server;

import java.awt.AWTException;
import java.awt.MouseInfo;
import java.awt.Point;
import java.awt.Robot;
import java.awt.event.InputEvent;
import java.awt.event.KeyEvent;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.Enumeration;

public class Server {
	private static Robot robot;
	private static String pass;

	@SuppressWarnings("resource")
	public static void main(final String[] args) throws IOException, AWTException {

		
		final Enumeration<NetworkInterface> ni = NetworkInterface.getNetworkInterfaces();

		if (args.length > 0) {
			pass = args[0];
		} else {
			pass = "s181s89898";
		}
		while (ni.hasMoreElements()) {
			final NetworkInterface n = (NetworkInterface) ni.nextElement();
			final Enumeration<InetAddress> en = n.getInetAddresses();
			while (en.hasMoreElements()) {
				final InetAddress i = (InetAddress) en.nextElement();
				final String address = i.getHostName();
				System.out.println(String.format("server started at %s:%s", address, server.getLocalPort()));
			}
		}

		final ServerSocket server = new ServerSocket(9999);
		robot = new Robot();

		while (true) {
			final Socket socket = server.accept();
			System.out.println("Connection establised");
			final InputStream inputStream = socket.getInputStream();
			handleSocketConnection(inputStream);
		}
	}

	private static void handleSocketConnection(final InputStream inputStream) throws IOException {
		new Thread(() -> {
			final BufferedReader br = new BufferedReader(new InputStreamReader(inputStream));
			boolean activated = false;
			String text = "";
			try {
				while ((text = br.readLine()) != null) {
					System.out.println(text);
					if (!activated) {
						if (text.equals(pass)) {
							activated = true;
						}
						continue;
					} else {

						final String[] splitCMD = text.split(" : ");
						process(splitCMD[0], splitCMD[1]);
					}
				}
			} catch (final IOException e) {
			}
		}).start();
	}

	private static void process(final String command, final String params) {
		new Thread(() -> {
			switch (command) {
				case "MOUSE_SCROLL": {
					final String[] values = params.split(",");
					float y = Float.parseFloat(values[1]);
					y /= 2;
					robot.mouseWheel((int) y);
				}
					break;
				case "MOUSE_LEFT_CLICK": {
					robot.mousePress(InputEvent.BUTTON1_MASK);
					robot.mouseRelease(InputEvent.BUTTON1_MASK);
				}
					break;
				case "MOUSE_DOUBLE_CLICK": {
					robot.mousePress(InputEvent.BUTTON1_MASK);
					robot.mouseRelease(InputEvent.BUTTON1_MASK);
					robot.mousePress(InputEvent.BUTTON1_MASK);
					robot.mouseRelease(InputEvent.BUTTON1_MASK);
				}
					break;
				case "MOUSE_RIGHT_CLICK": {
					robot.mousePress(InputEvent.BUTTON3_MASK);
					robot.mouseRelease(InputEvent.BUTTON3_MASK);
				}
					break;
				case "MOUSE_MOVE": {
					final String[] values = params.split(",");
					final float dx = Float.parseFloat(values[0]);
					final float dy = Float.parseFloat(values[1]);
					final Point location = MouseInfo.getPointerInfo().getLocation();

					final double x = location.getX() - dx;
					final double y = location.getY() - dy;
					robot.mouseMove((int) x, (int) y);
				}
					break;
				case "KEYBOARD_INPUT": {
					final String[] values = params.split(",");
					final int keyCode = Integer.parseInt(values[0]);
					if (keyCode == 0) {
						break;
					}
					final int event = KeyEvent.getExtendedKeyCodeForChar(keyCode);
					robot.keyPress(event);
					robot.keyRelease(event);
				}
					break;

				case "SP_1": {
					robot.keyPress(KeyEvent.VK_ALT);
					robot.keyPress(KeyEvent.VK_F4);
					robot.keyRelease(KeyEvent.VK_F4);
					robot.keyRelease(KeyEvent.VK_ALT);
				}
					break;
				case "SP_2": {
					robot.keyPress(KeyEvent.VK_PRINTSCREEN);
					robot.keyRelease(KeyEvent.VK_PRINTSCREEN);
				}
					break;
			}
		}).start();
	}
}